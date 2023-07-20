import React from 'react'

const Toggle = ({changeTheme}) => {
  return (
    <label className="ui-switch">
  <input type="checkbox" onChange={changeTheme}/>
  <div className="slider">
    <div className="circle"></div>
  </div>
</label>

  )
}

export default Toggle