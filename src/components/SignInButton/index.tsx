import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import styles from './styles.module.scss';
import { signIn, signOut, useSession } from 'next-auth/client'


export function SingInButton() {
	const [session] = useSession();

	return session ? (
		<button 
			type="button"
			className={styles.signInButton}
			onClick={() => signOut()}
		>
		<FaGithub color='#04D361' />
		{session.user.name}
		<FiX className={styles.closeIcon}/>
		</button>
		
	) : (
		<button 
			type="button"
			className={styles.signInButton}
			onClick={() => signIn('github')}
		>
		<FaGithub color='#eba417' />
		Sign in with GitHub
		</button>
		
	)
}