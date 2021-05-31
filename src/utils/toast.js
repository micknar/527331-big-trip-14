const SHOW_TIME = 5000;

const container = document.createElement('div');

container.classList.add('toast-container');
document.body.append(container);

export const renderToast = (message) => {
  const item = document.createElement('div');

  item.textContent = message;
  item.classList.add('toast-item');

  container.append(item);

  setTimeout(() => {
    item.remove();
  }, SHOW_TIME);
};
