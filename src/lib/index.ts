// export { default as ytoTable } from '../components/table.vue';
// console.log('test index')
// export { default as hello } from '../components/HelloWorld.vue';
// export {
//     HelloWorld
// }
import { App } from 'vue';
import table from '../components/table.vue';

const components = [table];

const install = (app: App) => {
    components.forEach(component => {
        app.component(component.name, component);
    });
};

export {
    table,
    install
};

export default {
    install
};
