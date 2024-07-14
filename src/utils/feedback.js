import Swal from 'sweetalert2';

export function showErrorMessage(message) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonColor: '#3572EF',
  });
}

export function showSuccessMessage(message) {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    confirmButtonColor: '#3572EF',
  });
}
