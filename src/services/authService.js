const STORAGE_KEY_USERS = 'budget_tracker_users'
const STORAGE_KEY_CURRENT_USER = 'budget_tracker_current_user'


function getUsers() {
 const usersJson = localStorage.getItem(STORAGE_KEY_USERS)
 return usersJson ? JSON.parse(usersJson) : []
}


function saveUsers(users) {
 localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users))
}


function initializeDemoAccount() {
 const users = getUsers()
 if (users.length === 0) {
   const demoUser = {
     email: 'demo@example.com',
     password: 'demo123',
     name: 'Demo Användare'
   }
   saveUsers([demoUser])
 }
}


export function register(email, password, name) {
 const users = getUsers()
  if (users.some(u => u.email === email)) {
   return false
 }


 const newUser = { email, password, name }
 users.push(newUser)
 saveUsers(users)


 const user = { email, name }
 localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user))
  return true
}


export function login(email, password) {
 const users = getUsers()
 const user = users.find(u => u.email === email && u.password === password)
  if (!user) {
   return false
 }


 const currentUser = { email: user.email, name: user.name }
 localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser))
  return true
}


export function getCurrentUser() {
 const userJson = localStorage.getItem(STORAGE_KEY_CURRENT_USER)
 return userJson ? JSON.parse(userJson) : null
}


export function logout() {
 localStorage.removeItem(STORAGE_KEY_CURRENT_USER)
}


if (typeof window !== 'undefined') {
 initializeDemoAccount()
}


export const authService = {
 register,
 login,
 getCurrentUser,
 logout,
 initializeDemoAccount,
}
