export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
  BEFOREBEGIN: 'beforebegin',
};

export const render = (container, template, position = RenderPosition.BEFOREEND) => {
  container.insertAdjacentHTML(position, template);
};
