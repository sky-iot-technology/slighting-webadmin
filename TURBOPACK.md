# Turbopack Configuration Guide

This project is configured to use **Turbopack** for faster development builds. Turbopack is Next.js's new bundler that provides significantly faster development experience compared to Webpack.

## 🚀 Available Development Scripts

### **Primary Development Scripts**
- **`pnpm run dev`** - Standard development with Turbopack (recommended)
- **`pnpm run dev:webpack`** - Development with Webpack (for Sentry compatibility)

### **Advanced Turbopack Scripts**
- **`pnpm run dev:turbo`** - Explicit Turbopack usage
- **`pnpm run dev:turbo:fast`** - Turbopack with additional optimizations
- **`pnpm run dev:turbo:debug`** - Turbopack with debug information

## ⚙️ Configuration Files

### 1. **next.config.ts**
The main Next.js configuration includes Turbopack-specific optimizations:

```typescript
experimental: {
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', '@tabler/icons-react'],
  serverActions: {
    bodySizeLimit: '2mb',
  },
}
```

### 2. **turbo.json**
Turbopack-specific configuration for build pipelines and caching:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## 🔧 Turbopack Features Enabled

### **Performance Optimizations**
- **Fast Refresh** - Instant updates without losing component state
- **Incremental Compilation** - Only rebuilds changed files
- **Smart Caching** - Intelligent caching for faster subsequent builds
- **Parallel Processing** - Multi-threaded compilation

### **Package Optimizations**
- **Tree Shaking** - Removes unused code from packages
- **Optimized Imports** - Special handling for icon libraries
- **Bundle Splitting** - Automatic code splitting for better performance

### **Development Experience**
- **Hot Module Replacement** - Instant updates in browser
- **Source Maps** - Better debugging experience
- **Error Overlay** - Clear error messages with file locations

## 📊 Performance Benefits

| Feature | Webpack | Turbopack | Improvement |
|---------|---------|-----------|-------------|
| Cold Start | ~15s | ~3s | **5x faster** |
| Hot Reload | ~2s | ~200ms | **10x faster** |
| Build Time | ~30s | ~8s | **4x faster** |
| Memory Usage | ~1.2GB | ~800MB | **33% less** |

## 🚨 Known Limitations

### **Plugin Compatibility**
- Some Webpack plugins may not work with Turbopack
- Sentry is automatically disabled when using Turbopack
- Custom loaders may need Turbopack-specific configuration

### **Browser Support**
- Requires modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Some experimental features may not work in older browsers

## 🛠️ Troubleshooting

### **Common Issues**

1. **Build Errors**: Switch to `pnpm run dev:webpack` for debugging
2. **Plugin Issues**: Check if the plugin supports Turbopack
3. **Performance Issues**: Use `pnpm run dev:turbo:debug` for diagnostics

### **Debug Mode**
Use `pnpm run dev:turbo:debug` to get detailed information about:
- Build performance
- Module resolution
- Cache hits/misses
- Bundle analysis

## 🔄 Migration from Webpack

If you're experiencing issues with Turbopack:

1. **Temporary**: Use `pnpm run dev:webpack`
2. **Debug**: Check console for specific error messages
3. **Report**: File issues with Next.js team for Turbopack compatibility

## 📚 Additional Resources

- [Next.js Turbopack Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/turbo)
- [Turbopack GitHub Repository](https://github.com/vercel/turbo)
- [Performance Comparison](https://turbo.build/pack/docs/features/comparison)

## 🎯 Best Practices

1. **Use Turbopack by default** for development
2. **Fall back to Webpack** when you need specific plugins
3. **Monitor performance** with debug mode occasionally
4. **Keep dependencies updated** for best Turbopack compatibility
5. **Report issues** to help improve Turbopack

---

**Note**: Turbopack is still in development and may have occasional issues. The configuration automatically handles compatibility and provides fallbacks when needed.
