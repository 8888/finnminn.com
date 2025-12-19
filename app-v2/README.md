# Terraform Azure Infrastructure

## Terraform Commands

```bash
# Initialize Terraform and download providers
terraform init

# Preview changes before applying
terraform plan

# Apply changes to create/update infrastructure
terraform apply
```

## Resources Created

- Azure resource group for all assets
- Static website-enabled Storage Account that serves the built site
- Azure Front Door Standard profile, endpoint, origin group, and route pointing at the static site
- Azure Front Door custom domain + managed TLS certificate for `finnminn.com`

## Custom Domain Checklist (Namecheap)

1. Decide on the Front Door endpoint name (defaults to `finnminn-site`). Azure automatically gives it the hostname `finnminn-site.azurefd.net`—you need this value for DNS.
2. **Before running `terraform apply`,** add the validation record Azure requires so the custom domain resource can be created:
   - Type: `CNAME`
   - Host: `afdverify`
   - Value: `afdverify.finnminn-site.azurefd.net`
   - TTL: `Automatic`
3. Add the record that serves traffic. For the root `finnminn.com`, Namecheap supports an `ALIAS` record (flattened CNAME). For `www.finnminn.com`, you can use a plain `CNAME`.
   - Type: `ALIAS` (or `CNAME` for `www`)
   - Host: `@` (or `www`)
   - Value: `finnminn-site.azurefd.net`
   - TTL: `Automatic`
4. Wait for DNS propagation (5–30 minutes), then run `terraform apply`. Azure Front Door will validate the domain and provision the managed certificate automatically.
5. Use `terraform output frontdoor_endpoint_hostname` and `terraform output frontdoor_custom_domain` to confirm the bindings once apply completes, then browse to `https://finnminn.com` (or `www`) to test.
