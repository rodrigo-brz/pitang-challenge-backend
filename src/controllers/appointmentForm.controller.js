const Yup = require('yup')
const AppointmentModel = require('../models/appointmentForm.model')
const validadeAge = require('../validation/validateAge')

class AppointmentForm {
  async index(req, res) {
    try {
      const users = await AppointmentModel.find()
      return res.send({ data: users })
    } catch (error) {
      return res.status(400).json({ message: 'Algo deu errado.' })
    }
  }

  async store(req, res) {
    const body = {
      ...req.body,
      birthday: new Date(req.body.birthday),
      schedulingDate: new Date(req.body.schedulingDate),
    }

    const schema = Yup.object().shape({
      name: Yup.string().min(3).required('*'),
      birthday: Yup.date().required('Data de Nascimento Inválida'),
      schedulingDate: Yup.date().required('Data de Agendamento Inválida'),
    })

    try {
      await schema.validate(body, { abortEarly: false })
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }

    if (
      body.schedulingDate.getHours() < 6 ||
      (body.schedulingDate.getMinutes() > 0 &&
        body.schedulingDate.getMinutes() < 30) ||
      (body.schedulingDate.getMinutes() > 30 &&
        body.schedulingDate.getMinutes() <= 59) ||
      body.schedulingDate.getHours() > 18
    ) {
      return res.status(400).json({ message: 'Horário inválido' })
    }

    const firstDate = new Date(
      body.schedulingDate.getFullYear(),
      body.schedulingDate.getMonth(),
      body.schedulingDate.getDate(),
      -3,
      0,
      0,
      0
    )

    const secondDate = new Date(
      body.schedulingDate.getFullYear(),
      body.schedulingDate.getMonth(),
      body.schedulingDate.getDate() + 1,
      -3,
      0,
      0,
      0
    )

    const timeLimit = await AppointmentModel.find({
      schedulingDate: body.schedulingDate,
    })

    const dailyLimit = await AppointmentModel.find({
      schedulingDate: { $gte: firstDate, $lte: secondDate },
    })

    if (dailyLimit.length >= 20 && !validadeAge(body)) {
      return res
        .status(400)
        .json({ message: 'Não há vagas disponiveis na data escolhida.' })
    }

    if (timeLimit.length >= 2 && !validadeAge(body)) {
      return res
        .status(400)
        .json({ message: 'Não há vagas disponiveis no horário escolhido.' })
    }

    if (validadeAge(body) && timeLimit.length >= 2) {
      if (!validadeAge(timeLimit[0])) {
        await AppointmentModel.findById(timeLimit[0].id).deleteOne()
      } else if (!validadeAge(timeLimit[1])) {
        await AppointmentModel.findById(timeLimit[1].id).deleteOne()
      } else {
        return res
          .status(400)
          .json({ message: 'Não há vagas disponiveis no horário escolhido.' })
      }
    }

    if (
      validadeAge(body) &&
      dailyLimit.length >= 20 &&
      timeLimit.length === 1
    ) {
      if (!validadeAge(timeLimit[0])) {
        await AppointmentModel.findById(timeLimit[0].id).deleteOne()
      } else {
        return res
          .status(400)
          .json({ message: 'Não há vagas disponiveis no horário escolhido.' })
      }
    }

    body.check = false

    const user = await AppointmentModel.create(body)
    return res.json({ data: user })
  }

  async remove(req, res) {
    const { id } = req.params

    try {
      const user = await AppointmentModel.findById(id)

      if (!user) {
        return res.send({ message: 'User not exist' })
      }

      await user.remove()

      return res.send({ message: 'User removed' })
    } catch (error) {
      return res.status(400).send({ message: error.message })
    }
  }

  async update(req, res) {
    const {
      body,
      params: { id },
    } = req

    const user = await AppointmentModel.findByIdAndUpdate(id, body, {
      new: true,
    })

    res.send({ data: user })
  }
}

module.exports = new AppointmentForm()
