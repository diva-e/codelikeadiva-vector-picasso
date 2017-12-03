/**
 * Easing function from http://robertpenner.com/easing/
 * @param {*} t current step
 * @param {*} b initial value
 * @param {*} c final value
 * @param {*} d total steps
 */
export function easeInCubic (t, b, c, d) {
    return c*(t/=d)*t*t + b;
}

/**
 * Easing function from http://robertpenner.com/easing/
 * @param {*} t current step
 * @param {*} b initial value
 * @param {*} c final value
 * @param {*} d total steps
 */
export function easeInExpo (t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
}

/**
 * Easing function from http://robertpenner.com/easing/
 * @param {*} t current step
 * @param {*} b initial value
 * @param {*} c final value
 * @param {*} d total steps
 */
export function easeOutCirc (t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}

/**
 * Easing function from http://robertpenner.com/easing/
 * @param {*} t current step
 * @param {*} b initial value
 * @param {*} c final value
 * @param {*} d total steps
 */
export function easeOutExpo (t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
}

/**
 * Output shade of given color
 * https://stackoverflow.com/a/13542669/440791
 * @param {String} color Given color defined in HEX
 * @param {Number} percent Interpolation between -1 and 1
 */
export function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

/**
 * Output Interpolation between two colors
 * @param {String} c0 First color in HEX
 * @param {String} c1 Second color in HEX
 * @param {Number} p Interpolation defined between 0 and 1
 */
export function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}

export function getRandomInt(min, max) {
    return Math.floor(this.getRandomFloat(min, max));
}

export function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

export function clamp(n) {
    return Math.round(n * 1000) / 1000;
}