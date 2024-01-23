import app from "./main.tsx"

const env = Deno.env.get("TERMUX_APK_RELEASE")
if(env){
  console.log("in dev server")
}
console.log("env:", env);

Deno.serve(app.fetch)
