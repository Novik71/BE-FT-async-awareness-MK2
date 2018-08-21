const {
  getArchEnemy,
  getFile,
  getFileMany,
  getSuperHeroes,
  getSingleHero
} = require('./utils/index');

const blockingEcho = (string) => {
  let startTime = Date.now();
  while (Date.now() < startTime + 3000);
  return string;
};

const asyncEcho = (string, cb) => {
   setTimeout(() => {
    cb(null, string);
   }, Math.random() * 3000 )
};

// 3. Write a function `fetchSingleHero`. It will need to take an error-first callback as its only argument. This function will need to invoke our `getSingleHero` function, and once it has recieved a response, invoke it's own callback function with the recieved hero's name.

const fetchSingleHero = (cb) => {
  getSingleHero((err, hero) => {
    cb(err, hero);
  })
}

// 4. Write a function `fetchSingleOpponent`. It will need to take an error-first callback as its only argument. It will invoke the `fetchSingleHero` function you just wrote to get the name of a superHero. Once recieved it will invoke `getArchEnemy` with the name of that superHero. Once a response is recieved from `getArchEnemy` it will invoke its original callback with the name of the heroes archEnemy.

const fetchSingleOpponent = (cb) => {
  fetchSingleHero((err, hero) => {
    getArchEnemy(hero, (err, enemy) => {
      cb(null, enemy);
    })
  })
}

// 5.  Write a function called `fetchSuperHeroes`. It will need to take an error-first callback as its only argument. This function will need to invoke our `getSuperHeroes` function and, once it has received a response, it will capitalise each superhero name. Finally, invoke the callback with an array of capitalised superhero names.

const fetchSuperHeroes = (cb) => {
  getSuperHeroes((err, heroes) => {
    cb(null, heroes.map(hero => hero.toUpperCase()))
  })
}

// 6.  Write a function called `fetchOpponents` that takes an error-first callback function, and will use the `fetchSuperHeroes` function you just wrote to get an array of capitalised superheroes. It then needs to invoke our function `getArchEnemy` with each of the superhero names. As you start receiving results from `getArchEnemy`, build up an array of objects with hero and villain properties. Once you have had all the responses from `getArchEnemy`, invoke your callback with your array of objects sorted alphabetically by superhero name. Example:
// `[{hero: 'BATMAN', villain: 'THE JOKER'}, {hero: 'CAPTAIN AMERICA', villain: 'RED SKULL'}, ...]`
// The array will take some time to build with the results of multiple calls to the villain database. **How will you know when it is ready to invoke the callback?**

const fetchOpponents = (cb) => {
  fetchSuperHeroes((err, heroes) => {
    let result = [];
    let callCount = 0;
    heroes.forEach((hero, index) => {
      getArchEnemy(hero, (err, villain) => {
        callCount ++;
        result[index] = { 'hero' : hero , 'villain' : villain };
        if (callCount === heroes.length) cb(null, result.sort(function (a,b) { return a.hero.localeCompare(b.hero)}))
      })
    })
  })
};

// 7.  Write a function called `fetchContentOfFiles` that takes an array of file names and an error-first callback. It will need to invoke `getFile(fileName, yourCallbackFunction)` for each file in the array. It then needs to collect all the responses and, once it has received the final response, it will need to invoke the callback in the order they were requested - not in the order they were returned in.**How will you keep track of the order of responses?**

const fetchContentOfFiles = (fileArray, cb) => {
  let fetchedFiles = [];
  let callCount = 0;
  fileArray.forEach((file, index) => {
    getFile(file, (err, fileContents) => {
      callCount++;
      fetchedFiles[index] = fileContents;
      console.log(fetchedFiles);
      if (callCount === fileArray.length) cb(null, fetchedFiles);
    });
  });
};

// 8.  Write a function called `fetchFilesAndLog`. It takes an array of file names and an error-first callback. It needs to invoke `getFile(fileName, yourCallbackFunction)` for each file in the array. It must log the results in the order they were requested and as soon as possible. If we have files 1, 2, 3 and 4, and 1 comes back first, we can log 1. If 3 then comes back, we need to wait until 2 has come back, and then log 2 and 3, and then 4 when we have the response. Once all the responses have been received, it needs to invoke the callback with the string 'Complete!'

const fetchFilesAndLog = (fileArray, cb) => {
  let fetchedFiles = [];
  let logCount = 0;
  fileArray.forEach((file, index) => {
    getFile(file, (err, fileContents) => {
      fetchedFiles[index] = fileContents;
      for (i=logCount; i<fileArray.length; i++) {
        if (fetchedFiles[i] !== undefined) {
          logCount++;
          console.log(fetchedFiles[i])
        } else break;
      }
      if (logCount ===fileArray.length) {
        cb(null, 'Complete!')
      }
    })
  })
}

// 9.  Multiple callbacks can be problematic - a credit card validation, for example, risks taking payment multiple times. Write a function called `fetchFileWithSingleCall` that takes a filename and an error-first callback. This function will need to invoke `getFileMany(fileName, yourCallbackFunction)`. You need to ensure this callback is only called once. You have written a lowbar function that may help with this.

const fetchFileWithSingleCall = (filename, cb) => {
  let hasBeenCalled = false;
  getFileMany(filename, (err, result) => {
    if (hasBeenCalled === false) {
      hasBeenCalled = true;
      cb(null, result);
    } 
  })
}

module.exports = {
  blockingEcho,
  asyncEcho,
  fetchSingleHero,
  fetchSingleOpponent,
  fetchSuperHeroes,
  fetchOpponents,
  fetchFilesAndLog,
  fetchContentOfFiles,
  fetchFileWithSingleCall
}