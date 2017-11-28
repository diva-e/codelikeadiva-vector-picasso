const res = 10;
const wrapper = document.getElementById('artwork-wrapper');
const container = document.getElementsByTagName('svg')[0];
const width = wrapper.offsetWidth;
const height = wrapper.offsetHeight;

const lineWidth = 0.001;
let r = 80;
let rand = .05;
let iter = 30;
let iterMult = 1.5;
let randMult = 1.06;
let radiusMult = 1.15;
let damp = 0.99;
const steps = 20;
const centerX = width/2;
const centerY = height/2;

let c;

class Artwork {
  constructor() {}

  init() {
    console.log('init');

    this.colors = this.generateShades('#0000ff', 100/iter)
    this.draw();
    this.draw();
    this.draw();
    this.draw();
    this.draw();
    this.draw();
    this.draw();
    this.draw();
    this.draw();
    this.draw();
  }

  multiPointQuadratic(points) {
    const pA = points[0];
    const pB = points[1];
    const pN = points[points.length - 1];
    const mid1x = this.clamp((pN.x + pA.x) / 2);
    const mid1y = this.clamp((pN.y + pA.y) / 2);
    let str = `M${mid1x},${mid1y}`;

    for(let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const midx = this.clamp((p0.x + p1.x) / 2);
        const midy = this.clamp((p0.y + p1.y) / 2);
        str += `Q${p0.x},${p0.y} ${midx},${midy}`;
      }
      str += `Q${pN.x},${pN.y} ${mid1x},${mid1y}`;
    return str;
  }

  baseCirclePoints(r) {
    const arr = [];
    for(let i = 0; i < steps; i++) {
        let a = i / steps * Math.PI * 2;
        arr.push({
            x: Math.cos(a) * r + centerX,
            y: Math.sin(a) * r + centerY,
            vx: 0,
            vy: 0
        });
    }
    return arr;
  }

  generateShades(color, percent) {   
    var f = parseInt(color.slice(1),16);
    var t = percent<0?0:255;
    var p = percent<0?percent*-1:percent;
    var R = f>>16,G=f>>8&0x00FF;
    var B = f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }

  getRandomInt(min, max) {
    return Math.floor(this.getRandomFloat(min, max));
  }

  getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  clamp(n) {
    return Math.round(n * 1000) / 1000;
  }

  draw() {
    c = this.baseCirclePoints(r);
    
    for(let j = 0; j < iter; j++) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const curve = this.multiPointQuadratic(c);
      
      for(let i = 0; i < c.length; i++) {
        let p = c[i];
        p.vx += this.getRandomFloat(-rand, rand);
        p.vy += this.getRandomFloat(-rand, rand);
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= damp;
        p.vy *= damp;
      }
      
      el.setAttributeNS(null, 'd', curve);
      // el.setAttributeNS(null, 'stroke', this.generateShades('#0000ff', j/iter * 100));
      el.setAttributeNS(null, 'stroke', 'blue');
      el.setAttributeNS(null, 'stroke-width', '0.1');
      // el.setAttributeNS(null, 'stroke-opacity', j/iter);
      el.setAttributeNS(null, 'fill', 'transparent');
      container.appendChild(el);
    }
    iter *= iterMult;
    iter = Math.min(iter, 1500);
    rand *= randMult;
    r *= radiusMult;

  }

}


export default Artwork;
