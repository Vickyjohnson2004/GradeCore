import type { Config } from 'tailwindcss';
const config:Config={content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{colors:{ink:'#10243e',brand:'#174a7e',paper:'#f5f7fa'}}},plugins:[]};export default config;
