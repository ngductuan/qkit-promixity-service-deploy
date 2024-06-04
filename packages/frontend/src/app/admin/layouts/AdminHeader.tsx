'use client'
import ImageCustom from '@/app/components/ImageCustom/ImageCustom'
import { ROUTE, StorageKey } from '@/constants'
import { useAuth } from '@/context/AuthContext'
import '@/sass/common/_common.scss'
import { IUserInformation } from '@/types/user'
import { getFromLocalStorage } from '@/utils/local-storage.util'
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Badge, Button, Col, Dropdown, Flex, Image, MenuProps, Space, theme, Tooltip, Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import '../admin.scss'

const { Text } = Typography

interface IAdminHeaderProps {
  collapsed: boolean
  setCollapsed: (_collapsed: boolean) => void
  setRouteValue: (_value: string) => void
}

const AdminHeader: React.FC<IAdminHeaderProps> = ({ collapsed, setCollapsed, setRouteValue }) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const storedUser = getFromLocalStorage(StorageKey._USER) as IUserInformation
  const [userImage, setUserImage] = useState<string>('')
  const { onLogout } = useAuth()

  useEffect(() => {
    if (storedUser) {
      setUserImage(storedUser.image)
    }
  }, [storedUser])

  const handleLogout = (): void => {
    onLogout()
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link href={ROUTE.ADMIN_PROFILE} className='p-2' onClick={() => setRouteValue(ROUTE.ADMIN_PROFILE)}>
          <Text>My Profile</Text>
        </Link>
      )
    },
    {
      key: '2',
      label: (
        <Text onClick={handleLogout} className='p-2  '>
          Log out
        </Text>
      )
    }
  ]

  return (
    <>
      <Col xs={12} md={6} lg={5} xl={4} className='h-100 --admin-header'>
        <Header style={{ backgroundColor: colorBgContainer, padding: 0 }} className='h-100'>
          <Flex
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            className='h-100'
          >
            <Link href={ROUTE.MANAGE_USER} onClick={() => setRouteValue(ROUTE.DASHBOARD)}>
              <Image
                src='/logo_light.png'
                className='header-logo'
                preview={false}
                alt='error'
                style={{ paddingLeft: 24 }}
              />
            </Link>
            <Button
              type='text'
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 20 }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 20 }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 40,
                height: 40,
                marginRight: 16
              }}
            />
          </Flex>
        </Header>
      </Col>

      <Col flex='auto' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Space className='me-4' size='large'>
          <Tooltip title='Notifications'>
            <Badge count={5} offset={[-6, 6]}>
              <BellOutlined style={{ fontSize: 24 }} className='action-button' />
            </Badge>
          </Tooltip>
          <Dropdown menu={{ items }} placement='bottomRight' arrow>
            <div>
              <ImageCustom
                width={36}
                height={36}
                src={userImage}
                preview={false}
                className='--avatar-custom d-cursor'
              />
            </div>
          </Dropdown>
        </Space>
      </Col>
    </>
  )
}

export default AdminHeader
