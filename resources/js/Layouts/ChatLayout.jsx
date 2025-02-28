import { usePage } from '@inertiajs/react'
import React from 'react'
import AuthenticatedLayout from './AuthenticatedLayout';

function ChatLayout({children}) {

    const page = usePage();
    const conservations = page.props.conservations;
    const selectedConservations = page.props.selectedConservations;

  return (
    <AuthenticatedLayout>
        ChatLayout
        {children}
    </AuthenticatedLayout>
  )
}

export default ChatLayout