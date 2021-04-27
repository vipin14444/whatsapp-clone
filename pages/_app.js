import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import Login from './login'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import firebase from 'firebase'

const LoadingWithNoSSR = dynamic(
  () => import('../components/Loading'),
  { ssr: false }
)

function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL
      }, { merge: true })
    }
  }, [user])

  if (loading) return <LoadingWithNoSSR />

  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
