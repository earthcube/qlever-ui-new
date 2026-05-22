# Qlever-UI Backend

FastAPI service that serves SPARQL endpoint configurations and shared queries.

## What it serves

| Route | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/endpoints/` | GET | All SPARQL endpoint configurations |
| `/endpoints/{slug}` | GET | Single endpoint configuration by slug |
| `/endpoints/{slug}/examples/` | GET | Example `.rq` queries for an endpoint |
| `/shared-query/` | POST | Store a SPARQL query, returns a short ID |
| `/shared-query/{short_id}` | GET | Retrieve a shared query by short ID |

## Storage

**Endpoint configurations** are loaded from a YAML file (`config.yaml` by default) into memory at startup. Each top-level key is a slug that maps to a `SparqlEndpointConfiguration` (name, URL, engine, prefix map, etc.).

**Example queries** are read from the filesystem. Each endpoint slug has a directory under `examples/` containing `.rq` files. Files created through the API use OS-safe, enumerated names (`example-001.rq`, `example-002.rq`, …); the human-readable name is stored in a leading frontmatter comment so it can contain characters that are invalid in filenames on non-Linux systems:

```
#+ title: My example query

SELECT * WHERE { ?s ?p ?o }
```

The frontmatter is YAML: stripping the `#+ ` prefix from each leading line yields a valid YAML mapping, and the `title` key holds the name (so names with special characters are quoted automatically). You can also drop in your own `.rq` files with arbitrary names — those without a `title` fall back to the filename as their name.

**Shared queries** are stored in a SQLite database (`data/data.db` by default). Queries are deduplicated by SHA-256 hash. Each row stores a 6-character alphanumeric short ID, the query text, a hash, creation date, share count, and view count. The database uses WAL mode.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `CONFIG_FILE` | `config.yaml` | Path to the YAML endpoint configuration file |
| `EXAMPLES_DIR` | `examples` | Directory containing example query files |
| `DB_FILE` | `data/data.db` | Path to the SQLite database |
| `CORS_ORIGINS` | `*` | Comma-separated list of allowed CORS origins |
| `API_KEY` | — | Required to use write endpoints (e.g. updating examples) |

## Running

```
uv run fastapi dev src/api/main.py
```
