# 🔧 cPanel Prisma WebAssembly Memory Solutions

**Problem**: `RangeError: WebAssembly.Instance(): Out of memory: wasm memory` when running `npx prisma generate` on cPanel shared hosting.

**Root Cause**: cPanel shared hosting has severe memory constraints (typically 4GB limit) that prevent Prisma CLI's WebAssembly compilation from succeeding. This is a known incompatibility documented in multiple GitHub issues.

---

## ✅ Solution 1: SSH Remote Access (Recommended)

**Success Rate**: High (multiple community confirmations)

### Steps:
1. **Enable SSH in cPanel**:
   - Go to cPanel → SSH Access → Manage SSH Keys
   - Generate and authorize a key pair

2. **Connect via SSH client** (NOT cPanel terminal):
   ```bash
   ssh robertki@your-cpanel-domain.com
   cd /home2/robertki/api.sheria.robertkibet.com
   source /home2/robertki/nodevenv/api.sheria.robertkibet.com/18/bin/activate
   npx prisma generate
   ```

3. **Why this works**: SSH bypasses cPanel's web terminal memory limitations

---

## ✅ Solution 2: Complete Local Build (Most Reliable)

**Success Rate**: Very High (eliminates server-side Prisma CLI entirely)

### Steps:
1. **Run the deployment script**:
   ```bash
   ./deploy-to-cpanel.sh
   ```

2. **Upload the generated `cpanel-deploy/` folder** to your cPanel

3. **No Prisma commands needed on cPanel** - everything is pre-built

### What this does:
- Builds TypeScript locally
- Generates Prisma Client locally  
- Packages production `node_modules/`
- Creates complete deployment package

---

## ✅ Solution 3: Pre-built Prisma Client

**Success Rate**: High (for teams/git workflows)

### Steps:
1. **Uncomment lines in `.gitignore`**:
   ```gitignore
   !node_modules/.prisma/
   !node_modules/@prisma/client/
   ```

2. **Generate locally and commit**:
   ```bash
   npm run prisma:generate
   git add node_modules/.prisma node_modules/@prisma
   git commit -m "Add pre-built Prisma Client for cPanel deployment"
   ```

3. **Deploy with pre-built client** - no generation needed

---

## ❌ What Doesn't Work on cPanel

- ~~NODE_OPTIONS memory flags~~ (you already tried this)
- ~~Different binary targets~~ (you already configured this)  
- ~~Various Node.js memory tweaks~~
- ~~cPanel web terminal workarounds~~

## 📋 Quick Decision Matrix

| Solution | Best For | Complexity | Success Rate |
|----------|----------|------------|--------------|
| SSH Access | One-time deployments | Low | High |
| Local Build | Production deployments | Medium | Very High |
| Pre-built Client | Team/Git workflows | High | High |

## 🎯 Recommended Approach

1. **Try SSH access first** (quickest to test)
2. **Use local build script for production** (most reliable)
3. **Use pre-built client for ongoing development** (best long-term)

## 📞 Community References

- GitHub Issue #16805: "Error Running Nestjs App with Prisma On Cpanel Shared Hosting"
- GitHub Discussion #6647: "Prisma on node.js cpanel shared hosting"  
- Multiple Stack Overflow posts confirming these solutions

**Bottom Line**: This is a known cPanel hosting limitation, not a configuration issue. The solutions above are the only proven workarounds.