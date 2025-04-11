import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card"

import { Button } from "./components/ui/button"

function TodoList({todos,removeTask}) {
  return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 py-6 mt-10">

{todos?.map((todo) => (
  <Card
    key={todo._id}
    className="w-full max-w-sm mx-auto bg-card border border-zinc-700 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 duration-300 ease-in-out"
  >
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
        {todo.title}
      </CardTitle>
    </CardHeader>

    <CardContent>
      <p className="text-base text-muted-foreground mb-4">
        {todo.description}
      </p>
      <div className="flex justify-end">
        <Button
          onClick={() => removeTask(todo._id)}
          variant="destructive"
          className="text-sm px-4 py-2"
        >
          Remove
        </Button>
      </div>
    </CardContent>
  </Card>
))}
</div>


  )
}

export default TodoList
