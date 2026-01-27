import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function Login() {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [error, setError] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const { login } = useAuth()
 const navigate = useNavigate()


 const handleSubmit = async (e) => {
   e.preventDefault()
   setError('')
   setIsLoading(true)


   try {
     const success = await login(email, password)
     if (success) {
       navigate('/dashboard')
     } else {
       setError('Fel email eller lösenord')
     }
   } catch (err) {
     setError('Ett fel uppstod. Försök igen.')
   } finally {
     setIsLoading(false)
   }
 }


 return (
   <div className="auth-container">
     <div className="auth-card">
       <h1>Logga in</h1>
       {error && <div className="error-message">{error}</div>}
       <form onSubmit={handleSubmit}>
         <div className="form-group">
           <label htmlFor="email">Email</label>
           <input
             id="email"
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             placeholder="din@email.com"
           />
         </div>
         <div className="form-group">
           <label htmlFor="password">Lösenord</label>
           <input
             id="password"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             placeholder="••••••••"
           />
         </div>
         <button type="submit" className="btn" disabled={isLoading}>
           {isLoading ? 'Loggar in...' : 'Logga in'}
         </button>
       </form>
       <div className="auth-link">
         Har du inget konto? <Link to="/register">Registrera dig här</Link>
       </div>
     </div>
   </div>
 )
}


export default Login
