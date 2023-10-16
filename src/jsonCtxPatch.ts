import { DataAction } from './types/types';
import mergeObjects from './mergeObjects';

/**
 * Aply all patches
 * 
 * @param {any} data
 * @param {DataAction[]} actions
 * @returns {void}
 */
export const aplyPatches = (data: any, actions: DataAction[]): void => {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i]; 
    aplyPatch(data, action);
  }
};

/**
 * Aply 1 patch to object
 * 
 * @param {any} data
 * @param {DataAction} action
 * @returns {void}
 */
const aplyPatch = (data: any, action: DataAction): void => {
  let path = action.path;
  const keep = !!action.keep ? action.keep : [];
  if (!!path && path.charAt(0) === "/") {
    path = path.slice(1);
  }
  const pathPieces = path.split(`/`);

  const removeKeys = (_object: any, _keep: string[]) => {
    if (!_object) return;
    if (typeof _object !== 'object') return;
    for (const propName in _object) {
      if (_keep.includes(propName)) continue;
      delete _object[propName];
    }
  };

  if (action.action === `write`) {    
    /**
    * WRITE
    */
    if (!path) {
      removeKeys(data, keep);
      data = mergeObjects(data, action.data);
    } else {
      let node = data;
      for (let i=0; i<pathPieces.length; i++) {
        const prop = pathPieces[i];
        const isLastItem = i === pathPieces.length - 1;
        if (isLastItem) {
          removeKeys(node[prop], keep);
          if (typeof node[prop] === `object` && typeof action.data === `object`) {
            node[prop] = mergeObjects(node[prop], action.data);
          } else {
            node[prop] = action.data;
          }
          break;
        }
        if (!node[prop]) node[prop] = {};
        node = node[prop];
      }
    }
  } else if (action.action === `delete`) {
    /**
    * DELETE
    */
    if (!path) return;
    let node = data;
    for (let i=0; i<pathPieces.length; i++) {
      const prop = pathPieces[i];
      const isLastItem = i === pathPieces.length - 1;
      if (isLastItem) {
        if (!Number.isNaN(prop) && Array.isArray(node)) {
          // Remove item from array
          node.splice(parseInt(prop), 1);
        } else {
          // Delete prop
        delete node[prop];
        }
        break;
      }
      node = node[prop];
    }
  } else if (action.action === `push`) {
    /**
    * PUSH
    */
    if (!path) return;
    let node = data;
    for (let i=0; i<pathPieces.length; i++) {
      const prop = pathPieces[i];
      const isLastItem = i === pathPieces.length - 1;
      if (isLastItem) {
        if (!Array.isArray(node[prop])) node[prop] = [];
        node[prop].push(action.data);
        break;
      }
      node = node[prop];
    }
  }
};