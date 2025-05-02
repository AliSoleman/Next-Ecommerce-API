"use client"
import Image from "next/image";
import {auth} from "@/app/auth"

export default async function Home() {
  const session = await auth();
  console.log(session);
  return ( session ? 
    <p>you are logged in </p> 
   : 
    <p> you need to log in </p> ) 
  
}
