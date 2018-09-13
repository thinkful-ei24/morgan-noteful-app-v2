// const hydrateNotes = (input) => {
//   const hydrated = [], cache = {};
//   // For each note returned...
//   for (const note of input) {
//     // Cache a reference to each note we will hydrate
//     if (!cache[note.id]) {
//       // Reference the note in cache
//       cache[note.id] = note;
//       // Add a tags array to the note object
//       cache[note.id].tags = [];
//       // Push the modified note to `hydrated`
//       hydrated.push(cache[note.id]);
//     }

//     // Add each corresponding tag to the hydrated note
//     if (note.tagId && note.tagName) {
//       // Push a new tag object to our cached note's tags array
//       cache[note.id].tags.push({
//         id: note.tagId,
//         name: note.tagName
//       });
//     }
//     // Remove redundant tags from each note
//     delete cache[note.id].tagId;
//     delete cache[note.id].tagName;
//   }
//   return hydrated;
// };

// This solution relies on the fact that objects are called by reference in JS.
// When we wish to return an array but don't want to iterate over all notes each time we search for a tag. 
// We can create a cache to store references to each item in the array, making our lookup O(1)
// The runtime is reduced from O(N^2) to O(N) with this algorithm
// This solution has a space-complexity of 2n => O(N)
const hydrateNotes = (input) => {
  const cache = {};
  return input.reduce((hydrated, note) => {
    // Check if note is stored in cache
    if (!cache[note.id]) {
      // Cache a reference to the note
      cache[note.id] = note;
      // Add a tags array to store all tags
      cache[note.id].tags = [];
      // Add a reference to the modified note in hydrated
      hydrated.push(cache[note.id]);
    }
    // Add the tag to the correct node
    // NOTE: this modifies both cache AND the object in hydrated
    if (note.tagId && note.tagName) {
      cache[note.id].tags.push({
        id: note.tagId,
        name: note.tagName
      });
    }
    // Clean up redundant tag on note
    // NOTE: this modifies both cache AND the object in hydrated
    delete cache[note.id].tagId;
    delete cache[note.id].tagName;
    // Return the accumulator to continue...
    return hydrated;
  }, []);
};

module.exports = hydrateNotes;
