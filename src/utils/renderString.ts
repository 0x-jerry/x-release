export function renderString(str: string, data: Record<string, string>) {
  return str.replace(/\$\{[^}]+\}/g, (item) => {
    const key = item.slice(2, -1)
    return data[key] || ''
  })
}
