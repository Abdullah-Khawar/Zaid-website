import { useState } from 'react'
import { ChevronDownIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import { Field, Label, Switch } from '@headlessui/react'

export default function Contact() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Contact Info */}
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Get in Touch With Us</h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eius tempor incididunt ut labore et dolore magna aliqua. Ut enim adiqua minim veniam quis nostrud exercitation ullamco.
          </p>

          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-start gap-4">
              <MapPinIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Our Location</h4>
                <p className="text-gray-600">99 S.t Jomblo Park Pekanbaru 28292, Indonesia</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <PhoneIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Phone Number</h4>
                <p className="text-gray-600">(+62)81 414 257 9980</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
              <div>
                <h4 className="font-semibold text-gray-900">Email Address</h4>
                <p className="text-gray-600">info@yourdomain.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div>
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Contact Sales</h2>
            <p className="mt-2 text-lg text-gray-600">Aute magna irure deserunt veniam aliqua magna enim voluptate.</p>
          </div>
          <form action="#" method="POST" className="mt-10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold text-gray-900">
                  First name
                </label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="mt-2 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold text-gray-900">
                  Last name
                </label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  className="mt-2 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="company" className="block text-sm font-semibold text-gray-900">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="mt-2 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-2 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-2 block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                />
              </div>
              <Field className="flex gap-x-4 sm:col-span-2">
                <Switch
                  checked={agreed}
                  onChange={setAgreed}
                  className={`${
                    agreed ? 'bg-indigo-600' : 'bg-gray-200'
                  } group relative flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out`}
                >
                  <span className="sr-only">Agree to policies</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      agreed ? 'translate-x-3.5' : 'translate-x-0'
                    } size-4 transform rounded-full bg-white ring-1 shadow-xs ring-gray-900/5 transition duration-200 ease-in-out`}
                  />
                </Switch>
                <Label className="text-sm text-gray-600">
                  By selecting this, you agree to our{' '}
                  <a href="#" className="font-semibold text-indigo-600">
                    privacy policy
                  </a>
                  .
                </Label>
              </Field>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-2 focus:outline-indigo-600"
              >
                Let's Talk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
