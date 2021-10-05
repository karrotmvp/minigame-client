import Mini from '@karrotmarket/mini'

let mini: Mini
export const getMini =()=> {
  if (mini) {
    return mini
  } else {
    return (mini = new Mini())
  }
}

