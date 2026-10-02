async function githubRepos(user){
  /*
  user (string): github user account name
  */
  const response = await fetch(`https://api.github.com/users/${user}/repos`, {
    method: 'GET',
    mode: 'cors',
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response.json();
}