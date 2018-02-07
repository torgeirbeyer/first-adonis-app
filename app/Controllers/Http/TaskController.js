'use strict'

const Task = use('App/Models/Task')
const { validate } = use('Validator')

class TaskController {
  // render all tasks
  async index ({ view }) {
    const tasks = await Task.all()

    return view.render('tasks.index', { tasks: tasks.toJSON() })
  }

  // validate and store task from inputfiled
  async store ({ request, response, session}) {
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:255'
    })

    //show validation messages upon validation fail
    if(validation.fails()) {
      session.withErrors(validation.messages())
        .flashAll()

      return response.redirect('back')
    }

    //persist to database
    const task = new Task()
    task.title = request.input('title')
    await task.save()

    // show success message if correct
    session.flash({ notification: 'Task added!' })

    // redirect back to the previous page
    return response.redirect('back')
  }

  // delete task from database
  async destroy({ params, session, response }) {
    const task = await Task.find(params.id)
    await task.delete()

    // Flash success message if deletede
    session.flash({ notification: 'Task deleted!' })

    return response.redirect('back')
  }
}

module.exports = TaskController
