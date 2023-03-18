import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'

// create an interface for the API response
interface APIResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

// create an interface for the listItems state variable
interface ListItem {
  prompt: string
  response: string
}

export default function Home() {
  // create a state variable for the input value
  const [inputValue, setInputValue] = useState('');
  // create a state variable for the list of items
  const [listItems, setListItems] = useState<ListItem[]>([]);

  // create a function to handle an input change and update the state
  const handleInputChange = (e: { target: any, preventDefault: () => void }) => {
    const { value } = e.target;
    e.preventDefault();
    setInputValue(value);
  }

  // create a function to handle the form submission
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    callAPI();
  }

  // make an API call to the next.js API route of this same page
  const callAPI = async () => {
    const res = await fetch('/api/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputValue }),
    });

    // create a function to map res.json() which correspond to the APIResponse interface to the interface ListItem
    const mapResponse = (response: APIResponse): ListItem => {
      return {
        prompt: inputValue,
        response: response.choices[0].message.content
      }
    }

    const json = await res.json();
    // set the state variable to the value returned from the API
    setListItems([...listItems, mapResponse(json)]);
    setInputValue('');
  }

  return (
    <>
      <Head>
        <title>V1</title>
      </Head>
      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <div className={styles.description}>
            <label htmlFor="input">Input:</label>
            <input onChange={handleInputChange} value={inputValue} />
            <button type="submit">Submit</button>
            <p className={styles.inputValue}>{inputValue}</p>
            {listItems && <div className={styles.list}>{listItems.map(item => (
              <>
                <p className={styles.prompt}>Prompt: {item.prompt}</p>
                <p className={styles.response}>Response: {item.response}</p>
              </>
            ))}</div>}
            <div>
              <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                By{' '}
                <Image
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  className={styles.vercelLogo}
                  width={100}
                  height={24}
                  priority
                />
              </a>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}
