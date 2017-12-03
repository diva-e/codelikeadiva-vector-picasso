import { getRandomFloat, getRandomInt, clamp, easeInCubic, easeInExpo, easeOutExpo, easeOutCirc, blendColors } from './utils';

const res = 10;
const wrapper = document.getElementById('artwork-wrapper');
const container = document.getElementsByTagName('svg')[0];
const width = wrapper.offsetWidth;
const height = wrapper.offsetHeight;

const iter = 40; // number of iterations for each sample
const randMult = 1.00000001; // scale up randomness on each sample
const radiusMult = 1.15; // increase radius on each sample
const damp = 0.2; // damp randomness by this on every segment. higher values output more contrast between first and last segment
const lineWidth = 0.1;
const segments = 35;
const centerX = width/2;
const centerY = height/2 * .8;
const numSamples = 10;

let r = 70; // initial radius
let rand = 5; // maximal random factor for each segment
let c;

class Artwork {
  constructor() {}

  init() {
    for (let i = 0; i < numSamples; i++) {
      this.drawInterpolation();
    }
  }

  multiPointQuadratic(points) {
    const pA = points[0];
    const pN = points[points.length - 1];
    const mid1x = clamp((pN.x + pA.x) / 2);
    const mid1y = clamp((pN.y + pA.y) / 2);
    let str = `M${mid1x},${mid1y}`;

    for(let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const midx = clamp((p0.x + p1.x) / 2);
        const midy = clamp((p0.y + p1.y) / 2);
        str += `Q${p0.x},${p0.y} ${midx},${midy}`;
      }
      // str += `Q${pN.x},${pN.y} ${mid1x},${mid1y}`; // close circle
    return str;
  }

  baseCirclePoints(r) {
    // memoize count
    if(this.baseCirclePoints.count === undefined) {
      this.baseCirclePoints.count = 0;
    } else {
      this.baseCirclePoints.count++;
    }
    const arr = [];
    const randomStart = clamp(Math.random() * .4) + 0;
    
    for(let i = 0; i < segments; i++) {
      let a = i / segments * Math.PI * 2;
      arr.push({
        x: Math.cos(a + randomStart) * r + centerX,
        y: Math.sin(a + randomStart) * r + centerY,
        vx: 0,
        vy: 0,
        mx: (i === segments - 1) ? 0 : easeOutExpo(i, 0, ((this.baseCirclePoints.count) / numSamples) * getRandomFloat(-rand, rand), segments),
        my: (i === segments - 1) ? 0 : easeOutExpo(i, 0, ((this.baseCirclePoints.count) / numSamples) * getRandomFloat(-rand, rand), segments),
      });
    }

    return arr;
  }

  drawInterpolation() {
    c = this.baseCirclePoints(r);
        
    for(let j = 0; j < iter; j++) { // create circles
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const curve = this.multiPointQuadratic(c);
      
      for(let i = 0; i < c.length; i++) { // set values for the points of the next interpolation 
        let p = c[i];

        p.vx += easeInCubic(i, 0, p.mx, c.length);
        p.vy += easeInCubic(i, 0, p.my, c.length),
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= damp;
        p.vy *= damp;
      }
      
      el.setAttributeNS(null, 'd', curve);
      el.setAttributeNS(null, 'stroke', blendColors('#0000ff', '#ff00ff', j/iter));
      el.setAttributeNS(null, 'fill', 'none');
      el.setAttributeNS(null, 'stroke-width', lineWidth);
      el.setAttributeNS(null, 'stroke-opacity', 1 - j/iter);
      el.setAttributeNS(null, 'fill-opacity', 0);
      container.appendChild(el);
    }

    rand *= randMult;
    r *= radiusMult;
  }

}


export default Artwork;
