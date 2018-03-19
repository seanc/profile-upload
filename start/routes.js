'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const Config = use('Config')
const { promisify } = use('util')
const fs = use('fs')

const stat = promisify(fs.stat)
const unlink = promisify(fs.unlink)

const members = Config.get('upload.members')

Route.on('/').render('index', { members })

Route.post('/upload', async ({ request, session, response }) => {
  const { member } = request.only('member')

  if (!members.includes(member)) {
    session.flash({
      error: 'Please provide a valid team member',
      members
    })
    return response.redirect('back')
  }

  const memberPicture = request.file('member_picture', {
    types: ['image'],
    size: '2mb'
  })

  if (!memberPicture) {
    session.flash({
      error: 'Please provide a profile picture',
      members
    })
    return response.redirect('back')
  }

  const memberPicturePath = `public/profiles/${member}.png`

  fs.stat(memberPicturePath, async (err, stat) => {
    if (stat) await unlink(memberPicturePath)

    await memberPicture.move('public/profiles', {
      name: `${member}.png`
    })

    if (!memberPicture.moved()) {
      session.flash({
        error: 'An error occurred while moving the image',
        members
      })
      return response.redirect('back')
    }
  })


  const normalizedName = member.charAt(0).toUpperCase() + member.slice(1)

  session.flash({
    success: `Member picture for ${normalizedName} updated!`,
    src: `/profiles/${member}.png`,
    members
  })
  return response.redirect('back')
})
