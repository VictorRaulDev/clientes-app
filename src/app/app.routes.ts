import { Routes } from '@angular/router';
import { CadastroClientesComponent } from './components/pages/cadastro-clientes/cadastro-clientes.component';
import { ConsultaClientesComponent } from './components/pages/consulta-clientes/consulta-clientes.component';
import { EdicaoClientesComponent } from './components/pages/edicao-clientes/edicao-clientes.component';


export const routes: Routes = [

        { 
            path: 'pages/cadastro-cliente', //ROTA 
            component: CadastroClientesComponent //COMPONENTE 
        },
        { 
            path: 'pages/consulta-cliente', //ROTA 
            component: ConsultaClientesComponent //COMPONENTE 
        },
        { 
            path: 'pages/edicao-cliente/:id', //ROTA 
            component: EdicaoClientesComponent //COMPONENTE 
        },
        
];
