import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-consulta-clientes',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './consulta-clientes.component.html',
  styleUrl: './consulta-clientes.component.css'
})
export class ConsultaClientesComponent {

  consultaForm: FormGroup;
  cliente: any = null;
  clientes: any[] = [];
  erroConsulta: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.consultaForm = this.fb.group({
      id: ['']
    });
  }

  consultarCliente(): void {
    this.erroConsulta = '';
    this.cliente = null;
    this.clientes = [];

    const id = this.consultaForm.value.id?.trim();

    if (id) {
      this.http.get(`http://localhost:8080/Listar/${id}`).subscribe({
        next: (res) => {
          this.cliente = res;
        },
        error: (err) => {
          console.error('Erro na consulta:', err);
          this.erroConsulta = 'Cliente não encontrado ou erro ao consultar.';
        }
      });
    } else {
      this.http.get<any[]>('http://localhost:8080/listar').subscribe({
        next: (res) => {
          this.clientes = res;
          if (this.clientes.length === 0) {
            this.erroConsulta = 'Nenhum cliente encontrado.';
          }
        },
        error: (err) => {
          console.error('Erro ao listar clientes:', err);
          this.erroConsulta = 'Erro ao buscar a lista de clientes.';
        }
      });
    }
  }
}
