


export default async function Home() {
  const authenticateUser = () => {
    const res = await fetch('http://localhost:3002' , 
      {
        method: 'POST'
      }
    )
  }
  return <div>
    <button>{user? <div>Logout</div> : <div>Signin</>} </button>
  </div>;
}
