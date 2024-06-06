import { Button, Input } from 'antd'
import React from 'react'
import './website-form.scss'
import { ICreateBusiness } from '@/types/business'

export default function WebsiteForm({
  handleOnChangeStep,
  data,
  handleOnChangeData
}: {
  handleOnChangeStep: (type: string) => void
  data: ICreateBusiness
  handleOnChangeData: (type: string, value: string | number | boolean | string[] | number[] | boolean[]) => void
}): React.ReactNode {
  return (
    <div className='name-form-main'>
      <div className='name-form-header d-flex mt-5 w-100 container'>
        <div className='content-left w-50 d-flex align-items-center justify-content-center'>
          <img
            className='thumb'
            src='https://raw.githubusercontent.com/ninehcobra/free-host-image/main/Proximity/website-thumb.png'
          />
        </div>
        <div className='content-right w-50  d-flex justify-content-center flex-column container'>
          <h3 className='title'>Add your online store.</h3>
          <div className='mt-3'>
            Enter a web address where customers can buy products. Or a website showcase about the service you&apos;re
            serving customers for.
          </div>
          <div className='input-wrapper mt-4'>
            <div className='input-label mb-2'>Your business website</div>
            <Input
              value={data.website}
              onChange={(e) => handleOnChangeData('website', e.target.value)}
              placeholder='Business website'
            />
          </div>
          <Button
            onClick={() => handleOnChangeStep('next')}
            disabled={!data.website}
            className='mt-4 btn-continue '
            type='primary'
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
