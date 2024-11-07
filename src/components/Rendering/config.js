// config.js
let group = 'last-30-days';

export const getGroup = () => group;

export const setGroup = (newGroup) => {
    console.log("Hello from config!!")
    group = newGroup;
};