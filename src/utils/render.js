import {RenderPosition} from '../const';

export const render = (container, template, position = RenderPosition.BEFOREEND) => {
  container.insertAdjacentHTML(position, template);
};
