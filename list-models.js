const apiKey = 'AIzaSyBlgKaDg6-ZRS1WLJ8AWaz5RoEXDw650Fo';
async function listModels() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  console.log(JSON.stringify(data.models.map(m => m.name), null, 2));
}
listModels().catch(console.error);
