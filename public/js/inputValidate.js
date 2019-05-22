const inputField = document.getElementById('url')

function checkInput() {
  if (inputField.value === '' || inputField.value.includes(' ')) {
    alert('Url cannot be empty or contains any space!')
    return false
  } else {
    return true
  }
}