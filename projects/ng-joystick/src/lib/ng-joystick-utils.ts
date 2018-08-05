
export const distance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return Math.sqrt((dx * dx) + (dy * dy));
};

export const angle = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    return degrees(Math.atan2(dy, dx));
};

export const findCoord = (p: {x: number, y: number}, dist: number, aDegrees: number) => {
    const aRadians = radians(aDegrees);
    const x = p.x - dist * Math.cos(aRadians);
    const y = p.y - dist * Math.sin(aRadians);
    return {x, y};
};

export const radians = (aDegrees: number) => {
    return aDegrees * (Math.PI / 180);
};

export const degrees = (aRadians) => {
    return aRadians * (180 / Math.PI);
};

// // Overwrite only what's already present
// export const safeExtend = (objA, objB): any => {
//     const obj = {};
//     for (const i in objA) {
//         if (objA.hasOwnProperty(i) && objB.hasOwnProperty(i)) {
//             obj[i] = objB[i];
//         } else if (objA.hasOwnProperty(i)) {
//             obj[i] = objA[i];
//         }
//     }
//     return obj;
//     // return {...objA, ...objB};
// };


// // ===================================================

// export const bindEvt = (el, arg, handler) => {
//     const types = arg.split(/[ ,]+/g);
//     for (const type of types) {
//         if (el.addEventListener) {
//             el.addEventListener(type, handler, false);
//         } else if (el.attachEvent) {
//             el.attachEvent(type, handler);
//         }
//     }
// };

// export const unbindEvt = (el, arg, handler) => {
//     const types = arg.split(/[ ,]+/g);
//     for (const type of types) {
//         if (el.removeEventListener) {
//             el.removeEventListener(type, handler);
//         } else if (el.detachEvent) {
//             el.detachEvent(type, handler);
//         }
//     }
// };

// export const trigger = (el, type, data) => {
//     const evt = new CustomEvent(type, data);
//     el.dispatchEvent(evt);
// };

// export const prepareEvent = (evt) => {
//     evt.preventDefault();
//     return evt.type.match(/^touch/) ? evt.changedTouches : evt;
// };

// export const getScroll = () => {
//     const x = (window.pageXOffset !== undefined) ?
//         window.pageXOffset :
//         (document.documentElement || <Element>document.body.parentNode || document.body)
//             .scrollLeft;

//     const y = (window.pageYOffset !== undefined) ?
//         window.pageYOffset :
//         (document.documentElement || <Element>document.body.parentNode || document.body)
//             .scrollTop;
//     return {
//         x: x,
//         y: y
//     };
// };

// export const applyPosition = (el, pos) => {
//     if (pos.top || pos.right || pos.bottom || pos.left) {
//         el.style.top = pos.top;
//         el.style.right = pos.right;
//         el.style.bottom = pos.bottom;
//         el.style.left = pos.left;
//     } else {
//         el.style.left = pos.x + 'px';
//         el.style.top = pos.y + 'px';
//     }
// };

// export const getTransitionStyle = (property, values, time) => {
//     const obj = configStylePropertyObject(property);
//     for (const i in obj) {
//         // the if(obj.hasOwnProperty(i)) seems useless since it is looping on all the properties of the object obj
//         if (obj.hasOwnProperty(i)) {
//             if (typeof values === 'string') {
//                 obj[i] = values + ' ' + time;
//             } else {
//                 let st = '';
//                 for (let j = 0, max = values.length; j < max; j += 1) {
//                     st += values[j] + ' ' + time + ', ';
//                 }
//                 obj[i] = st.slice(0, -2);
//             }
//         }
//     }
//     return obj;
// };

// export const getVendorStyle = (property, value) => {
//     const obj = configStylePropertyObject(property);
//     for (const i in obj) {
//         if (obj.hasOwnProperty(i)) {
//             obj[i] = value;
//         }
//     }
//     return obj;
// };

// export const configStylePropertyObject = (prop) => {
//     const obj = {};
//     obj[prop] = '';
//     const vendors = ['webkit', 'Moz', 'o'];
//     vendors.forEach(function (vendor) {
//         obj[vendor + prop.charAt(0).toUpperCase() + prop.slice(1)] = '';
//     });
//     return obj;
// };

// export const extend = (objA, objB) => {
//     for (const i in objB) {
//         if (objB.hasOwnProperty(i)) {
//             objA[i] = objB[i];
//         }
//     }
//     return objA;
// };

// // Map for array or unique item.
// export const map = function (ar, fn) {
//     if (ar.length) {
//         for (let i = 0, max = ar.length; i < max; i += 1) {
//             fn(ar[i]);
//         }
//     } else {
//         fn(ar);
//     }
// };
