import { useEffect, useState } from 'react';

function Prc() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // Save to localStorage when todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    setTodos([...todos, input]);
    setInput('');
  };

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default Prc;

// import { useEffect, useState } from 'react';

// function Prc() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [input, setInput] = useState('');
//   const [submitted, setSubmitted] = useState('');
//   const [theme, setTheme] = useState('light');

//   useEffect(() => {
//     fetch('https://jsonplaceholder.typicode.com/users')
//       .then(res => res.json())
//       .then(data => {
//         setUsers(data);
//         setLoading(false);
//       });
//   }, []);
//   const handleSubmit = e => {
//     e.preventDefault();
//     setSubmitted(input);
//     setInput('');
//   };
//   useEffect(() => {
//     const saved = localStorage.getItem('theme');
//     if (saved) setTheme(saved);
//   }, []);
//   useEffect(() => {
//     localStorage.setItem('theme', theme);
//   }, [theme]);
//   if (loading) return <div>Loading...</div>;

//   return (
//     <>
//       <button onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}>
//         Switch Theme
//       </button>
//       <ul>
//         {users.map(user => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//       <form onSubmit={handleSubmit}>
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Type something"
//         />
//         <button type="submit">Submit</button>
//         {submitted && <p> You submitted: {submitted} </p>}
//       </form>
//     </>
//   );
// }

// export default Prc;

// import { useState } from 'react';

// const Prc = () => {
//   const [name, setName] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saveStatus, setSaveStatus] = useState('');
//   const [counter, setCounter] = useState(0);

//   // Replace fetch with mock for testing
//   const mockFetch = () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve({
//           ok: true,
//           json: () => Promise.resolve({ name: 'John Doe' }),
//         });
//       }, 500);
//     });
//   };
//   // useEffect(() => {
//   //   fetch('http://localhost:5000/api/test')
//   //     .then(res => {
//   //       if (!res.ok) throw new Error('Network response was not ok');
//   //       return res.json();
//   //     })
//   //     .then(data => {
//   //       setName(data.name || 'No name found');
//   //       setError(null);
//   //     })
//   //     .catch(error => {
//   //       console.error(error);
//   //       setError(error.message);
//   //     })
//   //     .finally(() => setLoading(false));
//   // }, []);
//   const handleClear = () => {
//     setName('');
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/update-name', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: name }),
//       });
//       if (!response.ok) throw new Error('Save failed');
//       const data = await response.json();
//       setSaveStatus(' Saved!');
//       setTimeout(() => setSaveStatus(''), 2000);
//     } catch (error) {
//       setSaveStatus(' failed!');
//       setTimeout(() => setSaveStatus(''), 2000);
//     }
//   };
//   const incrementCounter = () => {
//     setCounter(prev => prev + 1);
//   };

//   if (error) {
//     return <div style={{ color: 'red' }}>Error: {error}</div>;
//   }
//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial' }}>
//       {/* Loading or Content */}
//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           {/* Display fetched name */}
//           <div style={{ marginBottom: '10px' }}>
//             <strong>Current name from API:</strong> {name}
//           </div>

//           {/* Input field */}
//           <input
//             value={name}
//             placeholder="Enter name"
//             onChange={e => setName(e.target.value)}
//             style={{ padding: '8px', marginRight: '10px', width: '200px' }}
//           />

//           {/* Clear button */}
//           <button
//             onClick={handleClear}
//             style={{ padding: '8px 16px', marginRight: '10px', cursor: 'pointer' }}
//           >
//             Clear
//           </button>

//           {/* Save button */}
//           <button
//             onClick={handleSave}
//             style={{
//               padding: '8px 16px',
//               marginRight: '10px',
//               cursor: 'pointer',
//               backgroundColor: '#4CAF50',
//               color: 'white',
//             }}
//           >
//             Save
//           </button>

//           {/* Save status message */}
//           {saveStatus && <span style={{ marginLeft: '10px', fontSize: '14px' }}>{saveStatus}</span>}

//           {/* Counter section */}
//           <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
//             <h3>Counter Demo</h3>
//             <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
//               Count: {counter}
//             </div>
//             <button
//               onClick={incrementCounter}
//               style={{
//                 padding: '8px 16px',
//                 cursor: 'pointer',
//                 backgroundColor: '#2196F3',
//                 color: 'white',
//               }}
//             >
//               Increment
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Prc;
