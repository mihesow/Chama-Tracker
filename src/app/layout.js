export const metadata = {
    title: 'Chama Tracker',
    description: 'Manage records, contributions, and loans seamlessly.',
  }
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body style={{ margin: 0, padding: 0, backgroundColor: '#f9fafb' }}>
          {children}
        </body>
      </html>
    )
  }