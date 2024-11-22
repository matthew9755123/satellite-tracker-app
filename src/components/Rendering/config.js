// config.js
let group = "last-30-days";
let groupCount;

export const getGroup = () => group;

export const setGroup = (newGroup) => {
  group = newGroup;
};

export const getGroupCount = () => groupCount;

export const setGroupCount = (newGroupCount) => {
  groupCount = newGroupCount;
};

let zoom;
export const setZoom = (newZoom) => {
  zoom = newZoom;
};

export const getZoom = () => zoom;
