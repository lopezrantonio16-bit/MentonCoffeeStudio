export function SiteFooter() {
  return (
    <footer className="px-6 py-12 border-t border-border">
      <div className="mx-auto max-w-4xl flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Menton Coffee Studio
        </span>
        <span className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
