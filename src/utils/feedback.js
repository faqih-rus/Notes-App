export function showFeedback(message, type = 'info') {
  Swal.fire({
    text: message,
    icon: type,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
}
