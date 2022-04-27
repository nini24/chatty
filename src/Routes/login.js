import '../styles/login.css'
import { CometChat } from '@cometchat-pro/chat'
import { NotificationManager } from 'react-notifications'
import config from '../config'
import { useState } from 'react'


export const Login = (props) => {
    const [uidValue,setUidValue] = useState('')
    const [isSubmitting,setIsSubmitting] = useState(false) 

    const handleSubmit = e => {
       e.preventDefault()
       setIsSubmitting(true)
       CometChat.login(uidValue,config.apiKey).then(
           User => {
               NotificationManager.success('You are now logged in','Login Success')
               console.log('Login Successful:', {User})
               props.setUser(User)
           },
           error => {
            NotificationManager.error('Please try again','Login Failed')
            console.log('Login failed with exception:', {error})
            setIsSubmitting(false)
           }
       )

    }


    return(
        <div className='loginbody'>
<>
       <section>
                <p className='heading'>Chattty</p>
                <p className='subtext'>Login with a known username</p>
            </section>
            <form onSubmit={handleSubmit}>
                <label>Enter a username</label> <br/>
                <input type='text' name='username' value={uidValue} onChange={e=>setUidValue(e.target.value)}/> <br/>
                <input type="submit" className='sub' value={`${isSubmitting ? 'Loading...':'Login'}`}  disabled={isSubmitting}/>
            </form>
            </>
        </div>
    )
}