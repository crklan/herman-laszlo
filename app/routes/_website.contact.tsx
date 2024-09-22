import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import {Form, json, useActionData} from '@remix-run/react'
import {toast} from 'sonner'

import portrait from '~/assets/portrait.png'
import {Button} from '~/components/ui/button'
import type {loader as layoutLoader} from '~/routes/_website'

import {Input} from '../components/ui/input'
import {Textarea} from '../components/ui/textarea'
import {jsonWithSuccess} from 'remix-toast'
import {Label} from '~/components/ui/label'

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

export const loader = async ({request}: LoaderFunctionArgs) => {
  return null
}

export const action: ActionFunction = async ({request}: ActionFunctionArgs) => {
  const body = await request.formData()
  //TODO - Add mail sending

  return jsonWithSuccess(
    {result: 'message sent'},
    {message: 'Your message has been sent'},
  )
}

export default function Index() {
  return (
    <div>
      <div className="bg-white w-full min-h-screen grid grid-cols-12 p-12 py-16 lg:p-20 lg:py-20">
        <div className="relative order-2 lg:order-1 col-span-12 lg:col-span-6 flex justify-center items-center">
          <img
            className="object-cover h-[90%] w-3/4 z-10 shadow-[-20px_20px_0_5px_rgba(61,140,204,1)] lg:shadow-[-30px_30px_0_5px_rgba(61,140,204,1)]"
            src={portrait}
            alt="Portrait of Laszlo"
          />
        </div>

        <div className="order-1 lg:order-2 col-span-12 lg:col-start-7 lg:col-span-6 flex flex-col gap-12">
          <div className="font-display text-5xl lg:text-7xl mt-20">Contact</div>
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
              <Label className="mb-4 block" htmlFor="message">
                Sporočilo
              </Label>
              <Textarea rows={10} placeholder="Your message" />
            </div>
            <Button size="lg" type="submit">
              Pošlji
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}
