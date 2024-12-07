import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node'
import {Form, json} from '@remix-run/react'
import {Resend} from 'resend'

import portrait from '~/assets/portrait.png'
import {Button} from '~/components/ui/button'
import {Label} from '~/components/ui/label'

import {Input} from '../components/ui/input'
import {Textarea} from '../components/ui/textarea'

/* export const meta: MetaFunction<
  typeof loader,
  {
    'routes/_website': typeof layoutLoader
  }
> = ({matches}) => {
  const layoutData = matches.find(
    (match) => match.id === `routes/_website`,
  )?.data
  const home = layoutData ? layoutData.initial.data : null
  const title = [home?.title, home?.siteTitle].filter(Boolean).join(' | ')

  return [{title}]
} */

const resend = new Resend(process.env.RESEND_API_KEY)

export const loader = async ({request}: LoaderFunctionArgs) => {
  return null
}

export const action: ActionFunction = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const name = formData.get('firstname') as string
  const email = formData.get('email') as string
  const message = formData.get('content') as string

  console.log(name, email, message)

  const {data, error} = await resend.emails.send({
    from: `Webpage <no-reply@laszloherman.com>`,
    replyTo: email,
    to: ['info@laszloherman.com'],
    subject: `New message from ${name}`,
    text: message,
  })

  console.log(error)
  if (error) {
    return json({error}, 400)
  }

  console.log(data)
  return json(data, 200)
}

export default function Index() {
  return (
    <>
      <div className="bg-white w-full grid grid-cols-12 px-12 py-16 xl:px-44 xl:py-20 gap-y-16 lg:gap-y-0">
        <div className="order-2 lg:order-1 col-span-12 lg:col-span-6 flex justify-center items-center">
          <img
            className="object-cover w-[50%] min-w-96 z-10 shadow-[-20px_20px_0_5px_rgba(61,140,204,1)] lg:shadow-[-30px_30px_0_5px_rgba(61,140,204,1)]"
            src={portrait}
            alt="Portrait of Laszlo"
          />
        </div>

        <div className="order-1 lg:order-2 col-span-12 lg:col-start-7 lg:col-span-6 flex flex-col gap-12">
          <div className="font-display text-5xl lg:text-7xl mt-20">Kontakt</div>
          <p>Pošljite povpraševanje ali stopite v kontakt.</p>
          <Form method="post" className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-6">
              <Label className="mb-4 block" htmlFor="firstname">
                Ime
              </Label>
              <Input type="text" name="firstname" placeholder="First Name" />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Label className="mb-4 block" htmlFor="lastname">
                Priimek
              </Label>
              <Input type="text" name="lastname" placeholder="Last name" />
            </div>
            <div className="col-span-12">
              <Label className="mb-4 block" htmlFor="email">
                Email
              </Label>
              <Input type="email" name="email" placeholder="Email" />
            </div>
            <div className="col-span-12 ">
              <Label className="mb-4 block" htmlFor="content">
                Sporočilo
              </Label>
              <Textarea
                id="content"
                name="content"
                rows={10}
                placeholder="Your message"
              />
            </div>
            <Button size="lg" type="submit">
              Pošlji
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}
