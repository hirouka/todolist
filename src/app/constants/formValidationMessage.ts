export const LOGIN = {
  email: {
    required: 'Email obligatoire',
    email: 'Email invalide'
  },
  password: {
    required: 'Mot de passe obligatoire',
    minlength: 'Password must be atleast 5 characters long'
  }
}

export const SIGNUP = {
  email: {
    required: 'Email is required',
    email: 'Email is invalid'
  },
  password: {
    required: 'Password is required',
    minlength: 'Password must be atleast 5 characters long'
  }
}

export const ADDTodoOrItem = {
  title: {
    required: 'Title is required',
  }
}

export const EDITPRODUCT = {
  name: {
    required: 'Name is required',
  },
  price: {
    required: 'Price is required',
  },
  size: {
    required: 'Size is required',
  },
  brand: {
    required: 'Brand is required',
  },
}
