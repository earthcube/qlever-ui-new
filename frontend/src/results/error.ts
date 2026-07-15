import { escapeHtml } from './utils';

export function render_query_error(err: any) {
  const errorTitle = document.getElementById('queryErrorTitle')! as HTMLSpanElement;
  const errorSubTitle = document.getElementById('queryErrorSubtitle')! as HTMLSpanElement;
  const resultsErrorQuery = document.getElementById('queryErrorQuery')! as HTMLPreElement;
  if (err.data) {
    errorTitle.textContent = '';
    errorSubTitle.textContent = '';
    resultsErrorQuery.innerHTML = '';
    resultsErrorQuery.classList.remove('hidden');
    switch (err.data.type) {
      case 'QLeverException':
        errorTitle.textContent = 'QLever return an error';
        errorSubTitle.textContent = err.data.exception;
        if (err.data.metadata) {
          resultsErrorQuery.innerHTML =
            escapeHtml(err.data.query.substring(0, err.data.metadata.startIndex)) +
            `<span class="text-red-500 dark:text-red-600 font-bold">${escapeHtml(err.data.query.substring(err.data.metadata.startIndex, err.data.metadata.stopIndex + 1))}</span>` +
            escapeHtml(err.data.query.substring(err.data.metadata.stopIndex + 1));
        } else {
          resultsErrorQuery.innerHTML = escapeHtml(err.data.query);
        }
        break;
      case 'Http':
        errorTitle.textContent = `The endpoint returned HTTP error ${err.data.status} (${err.data.statusText}).`;
        errorSubTitle.textContent = err.data.body;
        resultsErrorQuery.classList.add('hidden');
        break;
      case 'Connection':
        errorTitle.textContent = 'Could not reach the SPARQL endpoint.';
        errorSubTitle.textContent = `The server may be down, the endpoint URL may be wrong, or the request was blocked by the browser (e.g. CORS). Reason: ${err.data.message}`;
        resultsErrorQuery.innerText = err.data.query;
        break;
      case 'Canceled':
        errorTitle.innerHTML = `Operation was manually cancelled.`;
        resultsErrorQuery.innerText = err.data.query;
        break;
      case 'InvalidFormat':
        errorTitle.innerHTML = `Update result could not be deserialized: ${err.data.message}`;
        resultsErrorQuery.innerText = err.data.query;
        break;
      case 'Deserialization':
        errorTitle.innerHTML = `Query result could not be deserialized: ${err.data.message}`;
        resultsErrorQuery.innerText = err.data.query;
        break;
      default:
        console.log('uncaught error:', err);
        errorTitle.innerHTML = `Something went wrong but we don't know what...`;
        break;
    }
  }
  const resultsContainer = document.getElementById('results') as HTMLSelectElement;
  resultsContainer.classList.add('hidden');
  const resultsError = document.getElementById('resultsError') as HTMLSelectElement;
  resultsError.classList.remove('hidden');
  window.scrollTo({
    top: resultsError.offsetTop + 10,
    behavior: 'smooth',
  });
  throw new Error('Query processing error');
}
