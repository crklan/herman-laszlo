import {t} from '@lingui/core/macro'
import {Trans} from '@lingui/react/macro'
import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node'
import {Form, json, useActionData, useNavigation} from '@remix-run/react'
import {useEffect} from 'react'
import {Resend} from 'resend'
import {toast} from 'sonner'

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

  const {error} = await resend.emails.send({
    from: `Webpage <no-reply@laszloherman.com>`,
    replyTo: email,
    to: ['info@laszloherman.com'],
    subject: `New message from ${name}`,
    text: message,
  })

  if (error) {
    return json({success: false}, 400)
  }

  return json({success: true}, 200)
}

export default function Index() {
  const actionResponse = useActionData<{success: boolean}>()
  const navigation = useNavigation()

  useEffect(() => {
    if (actionResponse == null || actionResponse == undefined) return

    if (actionResponse.success) {
      toast.success(t`Message sent`, {id: 'message-test'})
    } else {
      toast.error(t`Message not sent. Please try again.`, {id: 'message-test'})
    }
  })

  return (
    <>
      <div className="bg-background w-full grid grid-cols-12 px-12 py-16 xl:px-44 xl:py-20 gap-y-16 lg:gap-y-0">
        <div className="order-2 lg:order-1 col-span-12 lg:col-span-6 flex justify-center items-center">
          <img
            className="object-cover w-[50%] min-w-96 z-10 shadow-[-20px_20px_0_5px_rgba(61,140,204,1)] lg:shadow-[-40px_40px_0_10px_rgba(61,140,204,1)]"
            src={portrait}
            alt="Portrait of Laszlo"
          />
        </div>

        <div className="order-1 lg:order-2 col-span-12 lg:col-start-7 lg:col-span-6 flex flex-col gap-12">
          <div className="font-display text-5xl lg:text-7xl mt-20">
            <Trans>Contact</Trans>
          </div>
          <p>
            <Trans>Contact us via mail or fill the form bellow.</Trans>
            <br />
            <a className="text-sky-600" href="mailto:info@laszloherman.com">
              info@laszloherman.com
            </a>
          </p>
          <Form method="post" className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-6">
              <Label className="mb-4 block" htmlFor="firstname">
                <Trans>First name</Trans>
              </Label>
              <Input type="text" name="firstname" placeholder={t`First name`} />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <Label className="mb-4 block" htmlFor="lastname">
                <Trans>Last name</Trans>
              </Label>
              <Input type="text" name="lastname" placeholder={t`Last name`} />
            </div>
            <div className="col-span-12">
              <Label className="mb-4 block" htmlFor="email">
                <Trans>Email</Trans>
              </Label>
              <Input type="email" name="email" placeholder={t`Email`} />
            </div>
            <div className="col-span-12 ">
              <Label className="mb-4 block" htmlFor="content">
                <Trans>Message</Trans>
              </Label>
              <Textarea
                id="content"
                name="content"
                rows={5}
                placeholder={t`Your message`}
              />
            </div>
            <Button
              disabled={navigation.state == 'submitting'}
              size="lg"
              type="submit"
            >
              <Trans>Send</Trans>
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}
