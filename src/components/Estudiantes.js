import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';


const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nuevoEstudiante, setNuevoEstudiante] = useState({ nombre: '', edad: '' });
  const [estudianteEnEdicion, setEstudianteEnEdicion] = useState(null);

  useEffect(() => {
    cargarEstudiantes();
  }, []);


  const cargarEstudiantes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/estudiantes')
      setEstudiantes(response.data)
    } catch (error) {
      console.error('Error al cargar los estudiantes', error);
    }
  };


  const agregarEstudiante = async (nuevoEstudiante) => {

    if (!nuevoEstudiante.nombre || !nuevoEstudiante.edad) {
      Swal.fire("Los campos son obligatorios");
      return;
    }

    try {
      await axios.post('http://localhost:5000/estudiantes', {
        ...nuevoEstudiante,
        id: uuidv4(),
      });
      cargarEstudiantes();
      setNuevoEstudiante({ nombre: '', edad: '' });
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Agregado con exito",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error al agregar estudiante', error)
    }
  }


  const actualizarEstudiante = async (estudianteActualizado, nuevoNombre, nuevaEdad) =>{

    const url = `http://localhost:5000/estudiantes/${estudianteActualizado.id}`;

    estudianteActualizado = {
      id: estudianteActualizado.id,
      nombre: nuevoNombre,
      edad: nuevaEdad
    }
    try{
      const response = await axios.put(url, estudianteActualizado);

      return response.data;

    }catch (error){
      throw new Error('Error al actualizar estudiante');
    }
  }




  const eliminarEstudiante = async (id) => {

    Swal.fire({
      title: "Estas seguro?",
      text: "No podrás revertir el proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar"
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          await axios.delete(`http://localhost:5000/estudiantes/${id}`);
          cargarEstudiantes();
        } catch (error) {
          console.error('Error al eliminar estudiante', error)
        }

        Swal.fire({
          title: "Eliminado",
          text: "El estudiante ha sido eliminado.",
          icon: "success"
        });
      }
    });

  }


  const handleAgregarEstudiante = () => {
    Swal.fire({
      title: 'Agregar Estudiante',
      html: `
        <div>
          <input
            type="text"
            class="swal2-input"
            placeholder="Nombre"
            id="nombre-input"
          />
          <input
            type="text"
            class="swal2-input"
            placeholder="Edad"
            id="edad-input"
          />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombreInput = document.getElementById('nombre-input').value;
        const edadInput = document.getElementById('edad-input').value;
  
  
        let nuevoEstudiante = {
          nombre: nombreInput,
          edad: edadInput
        }
        agregarEstudiante({
          nombre: nombreInput,
          edad: edadInput,
        });


      },
    });
  };

  const editarEstudiante = async (estudiante) => {

    setEstudianteEnEdicion(estudiante)
    
    
    Swal.fire({
      title: 'Editar Estudiante',
      html: 
        `<div>
        <input
          type="text"
          class="swal2-input"
          placeholder="Nombre"
          value="${estudiante.nombre}"
          id = "nombre-input"
        />
        <input
        type="text"
        class="swal2-input"
        placeholder="Edad"
        value="${estudiante.edad}"
        id = "edad-input"
      />
       </div>`
          
      , 
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {

        const nombreInput = document.getElementById('nombre-input').value;
        const edadInput = document.getElementById('edad-input').value;

        console.log(estudiante, nombreInput, edadInput)
        try {
          const response = await actualizarEstudiante(estudiante, nombreInput, edadInput);

          if (response){
            Swal.fire({
              icon: 'success',
              title: 'Cambios guardados exitosamente',
            });
          }
          cargarEstudiantes();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar cambios',
            text: 'Hubo un problema al intentar guardar los cambios. Por favor, intenta nuevamente.',
          });
        }
        setEstudianteEnEdicion(null);
      },
    });
  };

  


  return (
    <div className='px-4'>
      <h2 className='text-center mt-4 mb-4'>Estudiantes</h2>

      <div className='pl-4'>
        <button type="button" 
        class="btn btn-primary"
        onClick={handleAgregarEstudiante}
        >Agregar</button>
      </div>

      <div>
        <table className='table mx-auto text-center'>
          <thead className="thead-dark">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((estudiante) => (
              <tr key={estudiante.id}>

                <td>{estudiante.nombre}</td>
                <td>{estudiante.edad} años</td>
                <td>
                  <button className="btn btn-danger"
                    onClick={() => eliminarEstudiante(estudiante.id)}>Eliminar</button>
                  <span style={{ marginRight: '5px' }}></span>
                  <button className="btn btn-primary"
                    onClick={() => editarEstudiante(estudiante)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>

  );
};

export default Estudiantes;


